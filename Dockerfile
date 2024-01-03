# Use the official PostgreSQL 12 base image
FROM postgres:12

# Create a directory to store PostgreSQL data
RUN mkdir -p /var/lib/postgresql/data

# Set the owner and permissions for the data directory
RUN chown -R postgres:postgres /var/lib/postgresql/data
RUN chmod 700 /var/lib/postgresql/data

# Set the environment variable to specify the data directory
ENV PGDATA /var/lib/postgresql/data

# Expose the default PostgreSQL port
EXPOSE 5432

# Copy the initialization SQL script to the container
COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Start PostgreSQL server when the container starts
CMD ["postgres"]
